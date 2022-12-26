import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)

}


function typeText(element, text) {

  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index += 1;
    } else {
      clearInterval(interval);
    }
  }, 20)
}


function printImage(element, img_url) {

  element.src = img_url;

}


function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}



function chatStripe(isAi, value, uniqueId, isImage = false) {
  if (isImage) {
    return (
      `<div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
              <div class="profile">
                <img
                src="${isAi ? bot : user}"
                alt="${isAi ? 'bot' : 'user'}"
                />
              </div>
              <div class = "imageRes" >
                <img id = ${uniqueId}
                src="https://www.shareicon.net/data/256x256/2015/08/06/80990_load_512x512.png"
                alt="Response image"
                />
              </div>
            </div>
          </div>
        `
    )
  } else {
    return (
      `<div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class = "message" id = ${uniqueId}>
            ${value}
          </div>
        </div>
      </div>
    `
    )
  }
}


const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  let prompt_message = data.get('prompt');

  // user's chat stripe
  chatContainer.innerHTML += chatStripe(false, prompt_message, 'uuid');
  form.reset();


  // bot's chat stipe
  const uniqueId = generateUniqueId();


  if (prompt_message.length >= 2 && [':)', ':>'].includes(prompt_message.substring(0, 2)) ) {

    console.log("inside image handler");

    chatContainer.innerHTML += chatStripe(true, " ", uniqueId, true);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const imageDiv = document.getElementById(uniqueId);


    // Fetching image
    const response = await fetch('http://localhost:5000/draw',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt_message.substring(2),
          size: '256x256',
        })
      })

    clearInterval(loadInterval);

    if (response.ok) {
      const data = await response.json();
      const image_res = data.image_url;
      // plot image 
      printImage(imageDiv, image_res);

    } else {
      const err = await response.text();
      messageDiv.innerHTML = "Something went wrong while fetching image";
      alert(err);
    }


  } else {
    console.log("inside text handler");

    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);
    const response = await fetch('https://codex-ai-6gb7.onrender.com/',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          prompt: data.get('prompt')
        })
      })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';
    if (response.ok) {
      const data = await response.json();

      const parsedData = data.bot.trim();
      console.log(data);
      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();
      messageDiv.innerHTML = "Something went wrong";
      alert(err);
    }

  }



}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
