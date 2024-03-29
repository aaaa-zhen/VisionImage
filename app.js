 function uploadImage() {
            const fileInput = document.getElementById('file-input');
            if (fileInput.files.length === 0) {
                alert('Please select an image to upload.');
                return;
            }
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.base64Image) {
                    callOpenAI(data.base64Image);
                } else {
                    throw new Error('No base64 image data returned from the server.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('image-description').innerText = 'Failed to upload image.';
            });
        }

        function callOpenAI(base64Image) {
            const apiKey = 'sk-702YJEAotdxlkxgR603cF6799f4440D6A7FdCcD29eFa4d17'; // Replace with your actual API key
            // Call the OpenAI API with the base64 encoded image
            fetch('https://api.aihubmix.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4-vision-preview",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "分析图片内容，并简短的总结一下"
                                },
                                {
                                    type: "image",
                                    image: base64Image
                                }
                            ]
                        }
                    ],
                    max_tokens: 300
                })
            })
            .then(response => response.json())
            .then(data => {
                // Handle response from the API
                const contentText = data.choices[0].message.content;
                document.getElementById('image-description').innerText = contentText;
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('image-description').innerText = 'Failed to get image description.';
            });
        }

 //

 document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
            imagePreview.style.backgroundSize = 'cover'; // 使图片完全覆盖div，同时保持图片比例
            imagePreview.style.backgroundPosition = 'center'; // 居中图片
        };
        reader.readAsDataURL(file);
    }
});


document.addEventListener('paste', function(event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // 将粘贴事件的内容输出到控制台

    for (index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function(event) {
                // 当读取完成时，将图片显示在预览区域
                var imagePreview = document.getElementById('image-preview');
                imagePreview.style.backgroundImage = `url(${event.target.result})`;
                imagePreview.style.backgroundSize = 'cover';
                imagePreview.style.backgroundPosition = 'center';

                // 同时准备好FormData以便上传
                var formData = new FormData();
                formData.append('image', blob); // 使用blob

                // 这里可以添加上传逻辑，或者保存formData到某个地方以便后续上传
            };
            reader.readAsDataURL(blob); // 读取粘贴的文件
        }
    }
});



        
        
        