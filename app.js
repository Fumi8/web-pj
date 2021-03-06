let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides(){
    //In it Controller
    controller = new ScrollMagic.Controller();
    ///Select some thing
    const sliders = document.querySelectorAll(".slide");
    const nav = document.querySelector(".nav-header");
    //Loop over each slide
    sliders.forEach((slide, index, slides) =>{
    //複数の場合は()でくくる!
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //Gsap
    const slideTl = gsap.timeline({
       defaults: { duration: 1, ease: "expo.inOut" }
    });
    slideTl.fromTo(revealImg, {x: "0%" } , { x : "100%"});
    slideTl.fromTo(img, { scale: 2}, { scale: 1 }, '-=1');
    slideTl.fromTo(revealText, {x: "0%"} , { x: "100%"}, '-=0.75');
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%"}, "-=0.5");
    //-=1 it's animate -1sec sooner

        //Create Scen for making animation when scroll
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false,
            //reverse does not make animation again after scroll onece, does not diserper
        })
            .setTween(slideTl)
            //beaceuse of the setTween,animate after scroll
            .addIndicators({ 
            //addIndicators: to see the point of trigger and start
                colorStart: "white",
                colorTrigger: "white",
                name: "slide"
            })
            .addTo(controller);
            //New Animation
            const pageTl = gsap.timeline();
            //set next Slide for stacking the content of slide 
            let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
            //pushing down 50%
            pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%"});
            pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5});
            //reverse for back to the position
            pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%"}, "-=0.5");
            //Create new scene
            pageScene = new ScrollMagic.Scene({
                triggerElement: slide,
                duration: "100%",
                triggerHook: 0
            })
            .addIndicators({
                colorStart: "white",
                colorTrigger: "white",
                name: "page",
                indent: 200
            })
            .setPin(slide, {pushFollowers: false})
            //push make pussing up the next content
            .setTween(pageTl)
            .addTo(controller);
            //duration: hole height of slide
    });
}


const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e){
    mouse.style.top = e.pageY + "px";
    mouse.style.left = e.pageX + "px";
}
function activeCursor(e) {
    const item = e.target;
    if (item.id === "logo" || item.classList.contains("burger")){
        // ||　は or
        mouse.classList.add("nav-active");
    }else {
        mouse.classList.remove("nav-active");
    }
    if (item.classList.contains("explore")){
        mouse.classList.add("explore-active");
        gsap.to(".title-swipe", 1, { y: "0%"});
        mouseTxt.innerText = "Tap";
    }else {
        mouse.classList.remove("explore-active");
        mouseTxt.innerText = "";
        gsap.to(".title-swipe", 1, { y: "100%"});
    }        
}
function navToggle(e) {
    if(!e.target.classList.contains("active")){
        //e.target does not contains active
        e.target.classList.add("active");
        //下のfunctionについてのclass　activeをつくる
        gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
        gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
        gsap.to("#logo", 1, { color: "black"});
        gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)"});
        //45度ずつずらして、y軸を5ずつ調整すると均等にxになる
        //bgをblackにして線画見えるように
        //clipPathでサークルを広げる  
        document.body.classList.add("hide");
        //menu に対してスクロールさせたくない場合
    }else{
        //その他の場合には、つまりクリックされてactive classがaddされていない場合
        e.target.classList.remove("active");
        //下のfunctionについてのclass　activeをつくる
        gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
        gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
        gsap.to("#logo", 1, { color: "white"});
        gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)"});
        document.body.classList.remove("hide");
    }
    
}

//Barba page transition
const logo = document.querySelector('#logo');
barba.init({
    views: [
        {
            namespace: "home",
            // beforeEnterを設定してbeforeLeaveでスライドをアニメートさせることをfashionではstop=destroyする
            beforeEnter() {
                animateSlides();
                logo.href = './index.html';
                //navのリンクの階層を変えて、違うページにも適用できるようにする
            },
            beforeLeave(){
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: "fashion",
            beforeEnter(){
                logo.href = '../index.html';
                detailAnimation();
                gsap.fromTo('.nav-header', 1, { y: "100%"}, { y: "0%", ease: "power2.inOut" });
            }
        }
    ],
    transitions: [
        {
          leave({current,next}){
              //curent ：現在のページ、現在見ているページ　everything that wrapp inside of the "container"
              //to tell barba when to do it 
              let done = this.async();
              //Scroll to the top
              window.scrollTo(0, 0);
              //An animation
              const tl = gsap.timeline({defaults: {ease:'power2.inOut'}});
              tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
            //onComplete; gsapのメソッド
            tl.fromTo('.swipe', 0.75, {x:'-100%'}, {x: '0%', onComplete: done}, "-=0.5");
          }, 
          enter({current,next}){
            let done = this.async();
             //An animation swipe page
            const tl = gsap.timeline({defaults: {ease:'power2.inOut'}});
            tl.fromTo(
                '.swipe',
                 1, 
                 {x:'0%'}, 
                 {x: '100%', stagger:0.2, onComplete: done}, 
                 //stagager :delay each of them, one by one
            );
            tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1});
          }  
        }
    ]
});

function detailAnimation(){
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll(".detail-slide");
    slides.forEach((slide, index,slides) => {
        const slideTl = gsap.timeline({defaults: {duration:1}})
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector('img');
        slideTl.fromTo(slide, {opacity:1 }, {opacity:0 });
        //Scene 2
        detailScene = new ScrollMagic.Scene({
            trigger: slide,
            duration: '100%',
            triggerHook: 0
        }).setPin(slide, {pushFollowers:false})
        .setTween(slideTl)
        .addIndicators({
            colorStart: "white",
                colorTrigger: "white",
                name: "detailScene",
        })
        .addTo(controller);
    });
}

//Event Listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
// mousemove:マウスの動きに合わせる
animateSlides();