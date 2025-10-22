export class Player {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.color = `hsl(${Math.random() * 360}, 100%, 100%)`;
        this.position = {
            x: 0,
            y: 0
        }
    }
}