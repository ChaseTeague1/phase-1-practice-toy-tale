const toyCollection = document.getElementById('toy-collection');
const toyLink = 'http://localhost:3000/toys';
let addToy = false;


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', event => {
        event.preventDefault()
        addNewToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetchedToyObj();
});

function fetchedToyObj() {
  fetch(toyLink)
  .then(res => res.json())
  .then(toys => toys.forEach((toy) => {
    toyInfo(toy);
  }))
}

function toyInfo(toy){
  toyName = document.createElement('h2');
  toyImg = document.createElement('img');
  toyLikes = document.createElement('p');
  toyBtn = document.createElement('button');

  toyName.innerText = toy.name;
  toyImg.src = `${toy.image}`;
  toyImg.className = 'toy-avatar';
  toyLikes.innerText = `${toy.likes} Likes`;
  toyBtn.setAttribute('class', 'like-btn');
  toyBtn.setAttribute('id', toy.id);
  toyBtn.innerText = 'Like';
  toyBtn.addEventListener('click', (e) => {
    increaseLikes(e);
  })

  let card = document.createElement('div');
    card.className = 'card';
    card.append(toyName, toyImg, toyLikes, toyBtn);
    toyCollection.appendChild(card);
}

function addNewToy(info){
  fetch(toyLink, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      'name': info.name.value,
      'image': info.image.value,
      'likes': 0
    })
  })
    .then(res => res.json())
    .then((toyObj) => {
      let newToy = toyInfo(toyObj)
      toyCollection.append(newToy)
    })
}

function increaseLikes(e){
  e.preventDefault();
  let newNumberOfLikes = parseInt(e.target.previousElementSibling.innerText) + 1;
  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: 'PATCH',
    headers:
    {
    "Content-Type": "application/json",
    Accept: "application/json"
    },
    body: JSON.stringify({
    "likes": newNumberOfLikes
    })
  })
  .then(res => res.json())
  .then(() => {
    e.target.previousElementSibling.innerText = `${newNumberOfLikes} Likes`;
  })
}