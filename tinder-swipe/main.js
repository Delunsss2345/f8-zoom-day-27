const cardList = document.querySelector('.card-list');
const btnLike = document.querySelector('.like') ;
const btnDisLike = document.querySelector('.dislike') ;

let profiles = [
  {
    img: "./images/user1.jpg",
    name: "Nguyen Thi Mai",
    age: 25,
    bio: "Me anh Huy"
  },
  {
    img: "./images/user2.jpg",
    name: "Tran Bich Ngoc",
    age: 28,
    bio: "Me anh Huy"
  },
  {
    img: "./images/user3.jpg",
    name: "Le Thao Vy",
    age: 24,
    bio: "Me anh Huy"
  },
  {
    img: "./images/user4.jpg",
    name: "Pham Ngoc Anh",
    age: 30,
    bio: "Me anh Huy"
  },
  {
    img: "./images/user5.jpg",
    name: "Do Hong Nhung",
    age: 27,
    bio: "Me anh Huy"
  }
];
let liked = [];
let disliked = [];

const createProfile = (profile, idx) => {
  const avatar = document.createElement('figure');
  avatar.style.transform = "";
  avatar.style.opacity = 1;
  avatar.style.transition = "none";

  const extraUi = document.createElement('div');
  avatar.className = "card";
  extraUi.className = "card-profile";

  avatar.dataset.profileId = idx;

  const image = document.createElement('img');
  image.src = profile.img;
  avatar.appendChild(image);

  const nameAge = document.createElement('div');
  nameAge.className = 'name-age';
  nameAge.textContent = `${profile.name}, ${profile.age}`;

  const bio = document.createElement('div');
  bio.className = 'bio';
  bio.textContent = profile.bio;

  extraUi.appendChild(nameAge);
  extraUi.appendChild(bio);

  avatar.appendChild(extraUi);

  return avatar;
};


const renderProfile = () => {
  cardList.innerHTML = "";
  profiles.forEach((profile , index) => {
    const el = createProfile(profile , index);
    cardList.appendChild(el);
  })
}

renderProfile();

let dragging = false;
let currentCard = null;
let currentPos = {
  x: 0,
  deltaX: 0
};


const getTouchX = (e) => {
  const touch = e.touches?.[0] || e.changedTouches?.[0]; //phần cả 2 đều không có thì chắc chắn đang xài 
  return touch?.clientX ?? e.clientX ?? 0;
}; //touches xuất hiện khi bấm chuột và move , nên khi thả tay sẽ mất , từ đó dùng changedTouches để lấy lần cuối cùng


const handlerOnTouchStart = (e) => {
  const target = e.target.closest('[data-profile-id]');
  if (!target) return;

  currentCard = target;
  dragging = true;
  currentPos = {
    x: getTouchX(e),
    deltaX: 0
  };
};

const handlerOnTouchMove = (e) => {
  if (!dragging) return;
  e.preventDefault(); 
  currentPos.deltaX = getTouchX(e) - currentPos.x; //tính độ vuốt màn hình so với lần chạm đầu tiên

  if (currentCard) {
    btnLike.style.transform = "none" ;
    btnDisLike.style.transform = "none" ;
    btnLike.style.backgroundColor = "transparent" ;
    btnDisLike.style.backgroundColor = "transparent" ;

    currentCard.style.transition = "none"; //set lại none nếu không trên pc sẽ rất lag
    const rotate = (currentPos.deltaX / 190) * 15; //tối đa 15 độ (chia 360 độ sẽ xấu nêm e để thành 190)
    currentCard.style.transform = `translate(${currentPos.deltaX}px) rotate(${rotate}deg)`;
    if (rotate > 0) {
      btnLike.style.transform = `scale(1.1)`;
      btnLike.style.backgroundColor = `#00C897`; 
      btnLike.style.color = `#fff`;
    } else {
      btnDisLike.style.transform = `scale(1.1)`;
      btnDisLike.style.backgroundColor = `#FF6B6B`;
    }

    rotate > 0 ? currentCard.style.outlineColor = "green" : currentCard.style.outlineColor = "red";
  }
};

const handlerOnTouchEnd = (e) => {
  dragging = false;

  const target = e.target.closest('[data-profile-id]');
  if (!target) return;

  const deltaX = getTouchX(e) - currentPos.x;
  const rotate = deltaX / 190 * 15 ;
    
  //Nếu deltaX bé hơn 50 thì chưa kéo ra vùng set lại từ đầu
  if (currentCard && Math.abs(deltaX) <= 50) {
    currentCard.style.transition = "outline-color .2s , transform .2s ease";
    currentCard.style.transform = "";
    currentCard.style.outlineColor = "transparent";
    btnLike.style.transform = "none" ;
    btnDisLike.style.transform = "none" ;
    btnLike.style.backgroundColor = "transparent" ;
    btnDisLike.style.backgroundColor = "transparent" ;
    
    currentPos = { x: 0, deltaX: 0 };
  } else {

    currentCard.style.transition = "opacity .3s, transform .3s";
    currentCard.style.transform = `translate(${deltaX}px) rotate(${rotate}deg)`;
    currentCard.style.opacity = 0;
    btnLike.style.backgroundColor = "transparent" ;
    btnDisLike.style.backgroundColor = "transparent" ;
    const id = Number(currentCard.dataset.profileId);
     const profile = profiles[id];
      if (deltaX > 0) {
        liked.push(profile);
      } else {
        disliked.push(profile);
      }
    currentCard.ontransitionend = () => {
      currentCard.style.visibility = "hidden";
     
      profiles = profiles.filter((p, idx) => idx !== id);
      currentCard.remove();
      renderProfile();

      setTimeout(() => {
        currentCard = null;
        currentPos = { x: 0, deltaX: 0 };
      } , 10)

     console.log(profiles) ; 
     console.log(liked) ; 
     console.log(disliked) ; 
    }

  }
};

document.ontouchstart = handlerOnTouchStart
document.ontouchmove = handlerOnTouchMove
document.ontouchend = handlerOnTouchEnd

document.onmousedown = handlerOnTouchStart
document.onmousemove = handlerOnTouchMove
document.onmouseup = handlerOnTouchEnd

