const API_KEY = 'HIDDEN';
const BASE_URL = `https://superheroapi.com/api.php/${API_KEY}`;

const randomHero = () => {
    const id = parseInt(Math.random() * 731 + 1);
    console.log('chosen ', id)
    return id
}

const fetchHero = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        const data = await response.json();
        if (data.error) throw data.error;
        // console.log('raw data', data); // a lot more cool data in it for future improvements!
        return {
            name: data.name,
            alignment: data.biography.alignment,
            image: data.image.url,
            combat: parseInt(data.powerstats.combat) || 1,
            durability: parseInt(data.powerstats.durability) || 1,
            intelligence: parseInt(data.powerstats.intelligence) || 1,
            power: parseInt(data.powerstats.power) || 1,
            speed: parseInt(data.powerstats.speed) || 1,
            strength: parseInt(data.powerstats.strength) || 1,
        };
    } catch (error) {
        console.error('Failed to fetch', error);
        // display error
        return {
            name: 'Error',
            alignment: '',
            image: '',
            combat: 1,
            durability: 1,
            intelligence: 1,
            power: 1,
            speed: 1,
            strength: 1,
        };
    }
};

const populateStats = async (hero) => {
    const data = await fetchHero(randomHero());
    const heroO = document.getElementById(hero);

    heroO.getElementsByClassName('name')[0].textContent = data.name;
    heroO.getElementsByClassName('alignment')[0].textContent =
        data.alignment === 'bad' ? 'Villain' : data.alignment === 'good' ? 'Hero' : data.alignment;
    heroO.getElementsByClassName('intelligence')[0].style.width = `${data.intelligence}%`;
    heroO.getElementsByClassName('strength')[0].style.width = `${data.strength}%`;
    heroO.getElementsByClassName('speed')[0].style.width = `${data.speed}%`;
    heroO.getElementsByClassName('durability')[0].style.width = `${data.durability}%`;
    heroO.getElementsByClassName('power')[0].style.width = `${data.power}%`;
    heroO.getElementsByClassName('combat')[0].style.width = `${data.combat}%`;
    heroO.getElementsByClassName('image')[0].src = data.image;
    heroO.style.background = `url(${data.image})`;

    return { combat: data.combat, name: data.name };
};

const fight = async () => {
    const populate1 = populateStats('hero1');
    const populate2 = populateStats('hero2');
    const [h1, h2] = await Promise.all([populate1, populate2]);
    let winText;
    if (h1.combat > h2.combat || (!!h1.combat && !h2.combat)) winText = h1.name + ' is the winner!!';
    else if (h1.combat < h2.combat || (!h1.combat && !!h2.combat)) winText = h2.name + ' is the winner!!';
    else winText = 'DRAW!!';
    document.getElementById('winner').textContent = winText;
};

document.getElementById('fightBtn').onclick = fight;

const fallbackimg = (e) => {
    e.target.src = './img/unknown.jpg';
};

const images = document.querySelectorAll('.heroes .image');
for (image of images) {
    image.onerror = fallbackimg;
}

fight();
