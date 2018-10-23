var screenEvents = (function () {
    return {
        // URL BACKEND
        url: 'http://localhost:8080/api/logs/screen-events',

        /**
         * Funcion para iniciar captura de teclas de impresion de pantalla e impresora
         */
        init: function () {
            // LISTENER TECLA PRINTSCREEN
            var self = this;
            window.onkeyup = function (e) {
                if (e.keyCode === 44) {
                    self.report({
                        event: 'printscreen',
                        user: '',
                        datetime: new Date().getTime(),
                        url: this.location.url
                    });
                }
            }
            // LISTENER TECLAS CONTROL + P
            window.onkeydown = function (e) {
                if (e.ctrlKey && e.keyCode == 80) {
                    self.report({
                        event: 'printer',
                        user: '',
                        datetime: new Date().getTime(),
                        url: this.location.url
                    });
                }
            }
            // LISTENER EVENTO DE IMPRESION
            window.onafterprint = function (e) {
                self.report({
                    event: 'printer',
                    user: '',
                    datetime: new Date().getTime(),
                    url: this.location.url
                });
            }

            window.matchMedia("print").addListener(function () {
                // self.report({
                //     event: 'printer',
                //     user: '',
                //     datetime: new Date().getTime(),
                //     url: this.location.url
                // });
            });
        },

        /**
         * Funcion para enviar reporte de impresion de pantalla e impresora
         */
        report: function (data) {
            var http = new XMLHttpRequest();
            http.open('POST', this.url, true);
            http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    console.log(http.responseText);
                }
            }
            http.send(JSON.stringify(data));
        }
    }

})();
// INICIO DE MODULO
screenEvents.init();