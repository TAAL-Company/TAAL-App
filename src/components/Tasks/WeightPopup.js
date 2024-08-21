import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./taskCompStyle.css";

export default function WeightPopup(props) {
    useEffect(() => {
        const showAlert = async () => {
            const { value: login } = await Swal.fire({
                title: "enter the weight",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Look up",
                showLoaderOnConfirm: true,
                preConfirm: async (login) => {
                    props.objTime.dataEntered = login;
                    props.setDataEntered(login);
                    // try {
                    //     const githubUrl = `https://api.github.com/users/${login}`;
                    //     const response = await fetch(githubUrl);
                    //     if (!response.ok) {
                    //         return Swal.showValidationMessage(`Error: ${JSON.stringify(await response.json())}`);
                    //     }
                    //     return response.json();
                    // } catch (error) {
                    //     Swal.showValidationMessage(`Request failed: ${error}`);
                    // }
                    props.setModalOpen(false);
                },
                allowOutsideClick: () => {
                    !Swal.isLoading()
                    props.setModalOpen(false);
                }
            });

            // if (login) {
            //     Swal.fire({
            //         title: `${login}'s avatar`,
            //         imageUrl: login.avatar_url
            //     });
            // }
            props.setModalOpen(false);
        };

        showAlert();
    }, [props.modalOpen]);

    return (
        <div key={props.index}>
            {/* No button needed, alert will show automatically */}
        </div>
    );
}