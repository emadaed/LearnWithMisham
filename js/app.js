async function loadSurah(){

    const surah =
        document.getElementById(
            "surahSelect"
        ).value;

    const response =
        await fetch(
            `https://api.alquran.cloud/v1/surah/${surah}`
        );

    const data =
        await response.json();

    displayAyahs(
        data.data.ayahs
    );
}

function displayAyahs(ayahs){

    const container =
        document.getElementById(
            "quranContainer"
        );

    container.innerHTML = "";

    const saved =
        getHighlights();

    ayahs.forEach(ayah => {

        const div =
            document.createElement("div");

        div.className = "ayah";

        const words =
            ayah.text.split(" ");

        words.forEach((word,index)=>{

            const span =
                document.createElement("span");

            const id =
                `${ayah.number}-${index}`;

            span.className = "word";

            span.innerText =
                word + " ";

            if(saved.includes(id)){
                span.classList.add(
                    "highlight"
                );
            }

            span.onclick = ()=>{

                span.classList.toggle(
                    "highlight"
                );

                saveHighlight(id);
            };

            div.appendChild(span);
        });

        container.appendChild(div);
    });
}

loadSurah();