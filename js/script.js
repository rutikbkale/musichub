console.log("start");
let audio = new Audio();
let songs;
async function getSongs() {
    let list = await fetch("/Songs/");
    let res = await list.text();
    console.log(res);
    let div = document.createElement("div");
    div.innerHTML = res;
    let link = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < link.length; index++) {
        const element = link[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs;
}

async function main() {
    let songs = await getSongs();
    console.log(songs);
    let ul = document.querySelector(".song-card").getElementsByTagName("ul")[0];
    for (const song of songs) {
        ul.innerHTML = ul.innerHTML + `<li class="flex gap align-center cursor">
                <img src="/images/music.svg" alt="" class="invert">
                <div class="info">
                  <div class="song-name">${(song.replaceAll("%20", " "))}</div>
                </div>
                <div class="playNow flex gap align-center">
                  <img src="/images/play.svg" alt="" class="invert">
                </div>
               </li>`;
    }

    Array.from(document.querySelector(".song-card").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            playM(element.getElementsByTagName("div")[0].firstElementChild.innerHTML.trim());
        })
    });

    audio.addEventListener("timeupdate", () => {
        document.querySelector(".s-duration").innerHTML = `${timeConverter(audio.currentTime)}/${timeConverter(audio.duration)}`;
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        audio.currentTime = (audio.duration * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100;
    })

    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            play.src = "/images/pause.svg";
        }
        else {
            audio.pause();
            play.src = "/images/play.svg";
        }
    })

    prev.addEventListener("click", () => {
        audio.pause();
        let i = songs.indexOf(audio.src.split("/").slice(-1)[0]);
        if ((i - 1) >= 0) {
            playM(songs[i - 1])
            document.getElementById("infobar").style.height = "70px";
        }
    })

    next.addEventListener("click", () => {
        audio.pause();
        let i = songs.indexOf(audio.src.split("/").slice(-1)[0]);
        if ((i + 1) < songs.length) {
            playM(songs[i + 1])
            document.getElementById("infobar").style.height = "70px";
        }
    })

    document.querySelector(".s-volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        audio.volume = parseInt(e.target.value) / 100
        if (audio.volume > 0) {
            document.querySelector(".s-volume>img").src = document.querySelector(".s-volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    document.querySelector(".s-volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            audio.volume = 0;
            document.querySelector(".s-volume").getElementsByTagName("input")[0].value = 0;

        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            audio.volume = .10;
            document.querySelector(".s-volume").getElementsByTagName("input")[0].value = 10;
        }
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            const imageName = card.querySelector("img").getAttribute("src").split("/").pop();
            const songName = imageName.replace(".jpg", ".mp3");
            document.getElementById("infobar").style.height = "70px";
            playM(songName);
        });
    });
    
    document.querySelectorAll(".btn").forEach(btn =>{
        btn.addEventListener("click", ()=>{
            window.location.href="progress.html";
        });
    });

}

const playM = (a) => {
    audio.src = "/Songs/" + a;
    audio.play();
    play.src = "/images/pause.svg";
    document.querySelector(".s-name").innerHTML = a.replaceAll("%20", " ").replaceAll(".mp3", " ");
}

function timeConverter(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

main()