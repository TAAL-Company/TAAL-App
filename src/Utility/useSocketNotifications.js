import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import clientConfig from '../client-config';
import i18n from '../i18n';
import { getingDataRouteByIdFromNodejs, getingDataTasksByIdsFromNodejs } from '../components/api';
import { expandRouteTasksWithLoops, extractPathForSiteWithLoops, addStationDetailsToTask } from '../components/Sites/functions';
import { changePlaces, visitPlaces } from '../redux/actions/places';
import { changeTasks, changeCurrentTasks, changeCurrentTasksList } from '../redux/actions/tasks';
import { convertUsername } from '../components/functions';

/**
 * Hook that connects to the backend Socket.IO /notifications namespace.
 * - type "message"     → toast notification
 * - type "route-offer" → confirm dialog (accept / decline). On accept → starts the route immediately.
 *
 * Must be rendered inside the Redux <Provider>.
 */
const useSocketNotifications = () => {
  const socketRef = useRef(null);
  const userId = useSelector((state) => state.user?.user?.id);
  const username = useSelector((state) => state.user?.user?.username);
  const dispatch = useDispatch();

  // Keep refs in sync so socket callbacks always see the latest values
  const userIdRef = useRef(userId);
  const usernameRef = useRef(username);
  const dispatchRef = useRef(dispatch);
  useEffect(() => { userIdRef.current = userId; }, [userId]);
  useEffect(() => { usernameRef.current = username; }, [username]);
  useEffect(() => { dispatchRef.current = dispatch; }, [dispatch]);

  // Stable callback that always reads from refs
  const onNotification = useCallback((data) => {
    console.log('[Notifications] Received:', data);
    if (data.type === 'route-offer') {
      handleRouteOffer(data);
    } else {
      handleMessage(data);
    }
  }, []);

  useEffect(() => {
    const socket = io(`${clientConfig.baseUrl}/notifications`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Notifications] Socket connected:', socket.id);
      if (userIdRef.current) {
        socket.emit('register', userIdRef.current);
      }
    });

    socket.on('notification', onNotification);

    socket.on('disconnect', (reason) => {
      console.log('[Notifications] Socket disconnected:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNotification]);

  // Re-register when userId changes (e.g. after login)
  useEffect(() => {
    if (userId && socketRef.current?.connected) {
      socketRef.current.emit('register', userId);
    }
  }, [userId]);

  /** Show a simple toast for regular messages */
  const handleMessage = (data) => {
    const sender = data.createdByName ? `<br/><small style="color:#888;">${i18n.t('notification.from', 'מאת')}: ${data.createdByName}</small>` : '';
    Swal.fire({
      title: data.title,
      html: `${data.message || ''}${sender}`,
      icon: 'info',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
    });
  };

  /** Show a confirm popup for route-offer notifications */
  const handleRouteOffer = (data) => {
    const t = i18n.t.bind(i18n);
    const routeLabel = data.routeName || data.routeId || '';
    const sender = data.createdByName ? `<small style="color:#888;">${t('notification.from', 'מאת')}: ${data.createdByName}</small><br/>` : '';

    Swal.fire({
      title: data.title || t('notification.new_route', 'מסלול חדש'),
      html: `${sender}<p>${data.message || ''}</p><p style="font-weight:bold;font-size:1.15em;margin-top:8px;">${routeLabel}</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d4264',
      cancelButtonColor: '#d33',
      confirmButtonText: t('notification.accept', 'קבל'),
      cancelButtonText: t('notification.decline', 'דחה'),
      allowOutsideClick: false,
    }).then((result) => {
      const currentUserId = userIdRef.current;
      console.log('[Notifications] Route-offer result:', result.isConfirmed, 'routeId:', data.routeId, 'userId:', currentUserId);
      if (result.isConfirmed && data.routeId && currentUserId) {
        acceptAndStartRoute(data.routeId, currentUserId, t);
      }
    });
  };

  /** Accept the route on backend, then fetch + process it and navigate to Tasks */
  const acceptAndStartRoute = async (routeId, studentId, t) => {
    // Show loading
    Swal.fire({
      title: t('notification.loading_route', 'טוען מסלול...'),
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // 1. Tell backend to assign the route to this student
      console.log('[Notifications] Accepting route:', routeId, 'for student:', studentId);
      const res = await fetch(`${clientConfig.baseUrl}/notifications/accept-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeId, studentId }),
      });
      if (!res.ok) throw new Error(`accept-route HTTP ${res.status}`);

      // 2. Fetch the full route data
      console.log('[Notifications] Fetching route data...');
      const routeData = await getingDataRouteByIdFromNodejs(routeId);
      if (!routeData) throw new Error('Route not found');
      console.log('[Notifications] Route data:', routeData);

      // 3. Process route data (same logic as QR flow)
      let taskIds = [];
      let site_id = null;
      let siteName = '';
      let routeName = '';

      if (routeData.tasks && Array.isArray(routeData.tasks) && routeData.tasks[0]?.taskId) {
        // Node format: { id, name, tasks: [{position, taskId}], sites: [{id, name}] }
        taskIds = routeData.tasks
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((t) => t.taskId);
        site_id = routeData.sites?.[0]?.id;
        siteName = routeData.sites?.[0]?.name || '';
        routeName = routeData.name || '';
      } else if (routeData.acf?.tasks) {
        // WP format: { id, title.rendered, acf: { tasks, loops }, places: [siteIds] }
        taskIds = routeData.acf.tasks.map((t) => t.ID || t.id).filter(Boolean);
        site_id = routeData.places?.[0] ? String(routeData.places[0]) : null;
        siteName = '';
        routeName = routeData.title?.rendered || routeData.name || '';
      }

      console.log('[Notifications] taskIds:', taskIds, 'site_id:', site_id);
      if (!site_id || !taskIds.length) throw new Error('Invalid route data – no site or tasks');

      const fetchedTasks = await getingDataTasksByIdsFromNodejs(taskIds);
      if (!fetchedTasks || fetchedTasks.length === 0) throw new Error('No tasks loaded');
      console.log('[Notifications] Fetched', fetchedTasks.length, 'tasks');

      addStationDetailsToTask(fetchedTasks, {});

      const taskMap = {};
      fetchedTasks.forEach((t) => { if (t) taskMap[t.id || t.ID] = t; });

      const routeTaskRefs = taskIds.map((id) => ({ ID: id, id }));
      // Support both Node-format (routeData.loops) and WP-format (routeData.acf.loops)
      const loops = routeData.loops || routeData.acf?.loops || [];
      const expanded = expandRouteTasksWithLoops(taskMap, routeTaskRefs, loops);
      const [separateList, cleanList] = extractPathForSiteWithLoops(taskMap, expanded, site_id);

      if (!cleanList.length) throw new Error('No tasks for this route');

      // 4. Set localStorage
      localStorage.setItem('site_id', site_id);
      localStorage.setItem('site_title', siteName);
      localStorage.setItem('route_title', routeName);
      localStorage.setItem('route_id', routeData.id || routeData.ID || '');

      // 5. Dispatch Redux actions
      const d = dispatchRef.current;
      const currentDate = new Date().toISOString().split('T')[0];
      d(changePlaces([{ id: site_id, title: siteName }], currentDate));
      d(changeTasks(fetchedTasks, currentDate));
      d(visitPlaces(site_id));
      d(changeCurrentTasks(separateList));
      d(changeCurrentTasksList(cleanList));

      Swal.close();

      // 6. Navigate to the Tasks page
      const currentUsername = usernameRef.current || localStorage.getItem('userName') || '';
      const displayName = convertUsername(currentUsername);
      console.log('[Notifications] Navigating to /Tasks/' + displayName);
      // Use window.location (works from outside Router context)
      window.location.assign(`/Tasks/${displayName}`);
    } catch (err) {
      console.error('[Notifications] Failed to start route:', err);
      Swal.fire({
        title: t('notification.error', 'שגיאה'),
        text: t('notification.accept_failed', 'לא הצלחנו לקבל את המסלול'),
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
      });
    }
  };
};

export default useSocketNotifications;
