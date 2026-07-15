gsap.registerPlugin(ScrollTrigger);

const frases = gsap.utils.toArray(".frase-sticky h2");

frases.forEach((frase,i)=>{

    gsap.timeline({

        scrollTrigger:{
            trigger:".frase-destaque",
            start:`top+=${i*250} center`,
            end:`top+=${(i+1)*250} center`,
            scrub:true
        }

    })

    .to(frase,{
        opacity:1,
        y:0
    })

    .to(frase,{
        opacity:0,
        y:-80
    });

});