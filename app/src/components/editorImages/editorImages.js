import axios from "axios";
import React from "react";
import { toast } from 'react-toastify';

export default class EditorImages {
    constructor(element, virtualElement, refInput, isLoading, isLoaded) {
        this.element = element;
        this.virtualElement = virtualElement;
        this.imgUpLoader = refInput;

        this.element.addEventListener('click', () => this.onClick());
        this.isLoading = isLoading
        this.isLoaded = isLoaded;
    }

    onClick () {
        this.imgUpLoader.click();
        this.imgUpLoader.addEventListener('change', () => {
            if(this.imgUpLoader.files && this.imgUpLoader.files[0]) {
                let formData = new FormData();
                formData.append('image', this.imgUpLoader.files[0]);
                this.isLoading();
                axios.post('./api/uploadImage.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((res) => {
                    this.virtualElement.src = this.element.src = `./img/${res.data.src}`;
                    toast.success("Вы поменяли картинку!");
                    toast.info('Не забудьте сохранить изменения')
                })
                .catch(() => {
                    toast.error("Произошла ошибка при cмене картинки");
                })
                .finally(() => {
                    this.imgUpLoader.value = "";
                    this.isLoaded();
                })
            }
        });
    }
}