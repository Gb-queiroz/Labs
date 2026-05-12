        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        const image = new Image();
        let mouseX = canvas.width / 2;
        let mouseY = canvas.height / 2;
        const imageSize = 60;

        image.src = "liquidificador.webp"

        document.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            mouseX = Math.max(imageSize / 2, Math.min(x, canvas.width - imageSize / 2));
            mouseY = Math.max(imageSize / 2, Math.min(y, canvas.height - imageSize / 2));
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(image, mouseX - imageSize / 2, mouseY - imageSize / 2, imageSize, imageSize);

            requestAnimationFrame(animate);
        }

        image.onload = animate;