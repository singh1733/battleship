class Ship{
    constructor(length){
        this.length=length;
        this.hit=0;
        this.sunk=false;
    }

    hit() {
        this.hit++;
    }

    isSunk(){
        this.sunk=this.length==this.hit;
    }
}

module.export={Ship};