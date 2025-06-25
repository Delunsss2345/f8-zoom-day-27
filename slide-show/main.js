const slides = document.querySelectorAll('[data-slideMain]'); //Lấy tất cả slide

document.addEventListener("slideshow:change", (e) => {
  console.log(e.detail);
});
slides.forEach(slide => {
    const slideContent = slide.querySelector('[data-slideContent]');  
    const slideItems = slide.querySelectorAll('[data-index]'); 
    const dots = slide.querySelector('[data-dots]'); 
    const controls = slide.querySelector('[data-control]');

    let checkSpam = false ; 
    let currentIndex = 1;

    const maxIndex = slideItems.length - 1; //index thực tế

    const firstClone = slideItems[0].cloneNode(true); //chèn node ảo 1
    const lastClone = slideItems[maxIndex].cloneNode(true);//chèn node ảo 2


    slideContent.appendChild(firstClone); //thêm vào cuối
    slideContent.prepend(lastClone);// thêm vào đầu


    slideContent.style.transform = `translateX(-100%)`; //thêm vào đầu bị hiện slide cuối lùi về 100%


    setTimeout(() => {
        slideContent.style.transition = "transform 0.3s ease"; //thêm transtion tránh load trang sẽ hiện slide 6 trượt qua 1
    }, 10)
    let oldSlide = null;
    let currentSlideEl = null;
    //nextSlide và click bình thương có điểm chung gộp thành 1 hàm
    const nextSlide = (control) => {
        const oldDot = dots.querySelector(`[data-slide-to="${currentIndex - 1}"]`); //Xoá active node cũ
        if (oldDot) oldDot.classList.remove("active"); 
        oldSlide = slideItems[(currentIndex - 1 + slideItems.length) % slideItems.length];


        if(checkSpam) return ; // đang thực hiện sự kiện thì return 
        checkSpam = true ;  

        if (control === "prev") {   
            currentIndex--;
        } else if (control === "next") {
            currentIndex++;
        }
        if (currentIndex !== 0 && currentIndex !== maxIndex + 1) {
            const realIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
            currentSlideEl = slideItems[realIndex];

           
        }

        const offset = `-${currentIndex * 100}%`; //tính toán offset
        slideContent.style.transform = `translateX(${offset})`;
        
        if (currentIndex >= 1 && currentIndex <= maxIndex + 1) { //Cập nhập newDot , nếu có thì active không thì thôi
            const newDot = dots.querySelector(`[data-slide-to="${currentIndex - 1}"]`);
            if (newDot) newDot.classList.add("active");
        }

    };



    controls.onclick = (e) => {
        const control = e.target.closest("[data-slide]");
        if(!control) return ; 
        nextSlide(control.dataset.slide) ;  //có thì next slide
    }

    let play = setInterval(() => nextSlide("next"), 3000); //lấy mã setInterval
    
    slide.addEventListener("mouseenter", () => clearInterval(play)); //chuột vào thì clear

    slide.addEventListener("mouseleave", () => {
        play = setInterval(() => nextSlide("next"), 3000); //chuột levave thì tiếp tục
    });


    slideContent.addEventListener('transitionend', () => { //Bắt kết thúc transition
        checkSpam = false; //false
        if (oldSlide && currentSlideEl) {
            document.dispatchEvent(new CustomEvent('slideshow:change', {
                detail: {
                    old: oldSlide,
                    current: currentSlideEl
                }
            }));

        
            oldSlide = null;
            currentSlideEl = null;
        }
        if (currentIndex === slideItems.length + 1) {
            slideContent.style.transition = "none"; //set tắt transition
            currentIndex = 1; //quay lại nút đầu

            slideContent.style.transform = `translateX(-${currentIndex * 100}%)`; // quay lại
            const newDot = dots.querySelector(`[data-slide-to="0"]`); //set dot quay lại nút đầu vì đã xoá ở hàm trên

            if (newDot) newDot.classList.add("active");
            setTimeout(() => {
                slideContent.style.transition = "transform 0.3s ease"; //thêm transtion chậm
            }, 10);
        }

        if (currentIndex === 0) {
            slideContent.style.transition = "none";
            currentIndex = slideItems.length;  //set bằng hơn tối đa để thành nút clone phụ

            slideContent.style.transform = `translateX(-${currentIndex * 100}%)`;

            const newDot = dots.querySelector(`[data-slide-to="${maxIndex}"]`);
            if (newDot) newDot.classList.add("active");
            
            setTimeout(() => {
                slideContent.style.transition = "transform 0.3s ease";
            }, 10);
        }
    });

});


