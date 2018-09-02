export default class Cards {
    constructor(ele, data) {
        let $ul = document.createElement('ul');
        $ul.className = 'cards';
        data.map((cardData)=> {
            
            let $li = document.createElement('li');
            $li.className = 'card';
            $li.setAttribute('style', `background-image: url(${cardData.imageUrl})`);
            $li.innerHTML = `<div class="card-text">
                                    <header class="card-header">
                                        <svg width="16" height="16"><use href="#some-icon"/></svg>
                                        <h2 class="card-title">${cardData.title}</h2>
                                    </header>
                                    <p class="card-description">${cardData.description}</p>
                                </div> 
                                <div class="card-edit-option">
                                    <button type="button" class="card-edit-button">Open</button>
                                    <button type="button" class="card-edit-button">Delete</button>
                                    <button type="button" class="card-edit-button">Print</button>
                                </div>`;
            $ul.append($li);
        })
        ele.append($ul);
    }
}