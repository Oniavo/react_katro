import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logos: Array<Array<GameObjects.Image>>;
    vatos: any;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    vatoPlaceHolder: any;
    logoTween: Phaser.Tweens.Tween | null;
    gameState: any;
    allVatos: Array<GameObjects.Image>

    constructor ()
    {
        super('MainMenu');
    }

    preload ()
    {
        this.allVatos = []
        this.gameState = {
            p1:Array(8).fill(2),
            p2:Array(8).fill(2)
        }
        this.vatoPlaceHolder = {
            p1:[
                {x:95+195*0,y:255},
                {x:95+180*1,y:255},
                {x:95+180*2,y:255},
                {x:95+183*3,y:255},

                {x:95+183*3,y:90},
                {x:95+180*2,y:90},
                {x:95+180*1,y:90},
                {x:95+195*0,y:90},
                
            ],
            p2:[
                {x:95+195*0,y:461},
                {x:95+180*1,y:461},
                {x:95+180*2,y:461},
                {x:95+183*3,y:461},

                {x:95+183*3,y:625},
                {x:95+180*2,y:625},
                {x:95+180*1,y:625},
                {x:95+195*0,y:625},
            ],
        }
        
        this.logos = []
        this.load.image('background', 'assets/background.png');
        this.load.image('vato', 'assets/vato.png');
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async play (player:any ,opposant: any,position: number){
        let current = position //position voaloany
        do{
            let value = player[current]
            player[current] = 0
            for (let i = current; i < current+value; i++) {
                player[(i + 1) % 8]++;
                this.draw()
                await this.sleep(100)
            }
            current = (current+value)%8
            if (player[current] <= 1) break
            if(current <= 3){
                player[current] += opposant[current]
                opposant[current] = 0
                this.draw()
                await this.sleep(500)
            }
            console.log("Current est: ", player[current])
        }while(player[current] > 1)
        this.draw()
    }

    draw(){
        this.allVatos.forEach((element:any) => {
            element.destroy()
        });
        this.allVatos = []
        for(let i = 0; i<this.gameState.p1.length; i++){
            const currentCase = []
            let x_stride = 0
            let y_stride = 0
            let break_point = Math.floor(Math.sqrt(this.gameState.p1[i]))
            for(let j = 0;j<this.gameState.p1[i];j++){
                const vato = this.add.image(
                    this.vatoPlaceHolder.p1[i].x+x_stride - 50*(this.gameState.p1[i]/16), 
                    this.vatoPlaceHolder.p1[i].y+y_stride - 50*(this.gameState.p1[i]/16), 
                    'vato'
                ).setDepth(100)
                this.vatos.add(vato)
                this.allVatos.push(vato)
                currentCase.push(vato)
                x_stride += 26; 

                
                if (x_stride >= 26*break_point) { 
                    x_stride = 0;
                    y_stride += 26; 
                }
            }
            this.logos.push(currentCase)
        }
        for(let i = 0; i<this.gameState.p2.length; i++){
            const currentCase = []
            let x_stride = 0
            let y_stride = 0
            let break_point = Math.floor(Math.sqrt(this.gameState.p2[i]))
            for(let j = 0;j<this.gameState.p2[i];j++){
                const vato = this.add.image(
                    this.vatoPlaceHolder.p2[i].x+x_stride - 50*(this.gameState.p2[i]/16), 
                    this.vatoPlaceHolder.p2[i].y+y_stride - 50*(this.gameState.p2[i]/16), 
                    'vato'
                ).setDepth(100)
                this.vatos.add(vato)
                this.allVatos.push(vato)
                currentCase.push(vato)
                x_stride += 26;

               
                if (x_stride >= 26*break_point) {
                    x_stride = 0;
                    y_stride += 26;
                }
            }
            this.logos.push(currentCase)
        }
    }

    create ()
    {
        this.vatos = this.physics.add.group()
        this.background = this.add.image(737/2, 707/2, 'background');
        for(let i = 0; i<this.gameState.p2.length; i++){
            this.add.circle(
                this.vatoPlaceHolder.p2[i].x,
                this.vatoPlaceHolder.p2[i].y,
                80,
            ).setInteractive().on("pointerdown", async (pointer:any)=>{
                console.log(i)
                await this.play(this.gameState.p2,this.gameState.p1,i)
                alert('Mandry i P1')
                const max = this.getMaxScore(this.gameState.p2,this.gameState.p1)
                console.log("=>Max:",max)
                await this.play(this.gameState.p1,this.gameState.p2,max)
                alert('Mandry i IA')
            })
        }


        this.draw()

        // this.physics.add.overlap(this.vatos, this.vatos, this.preventStacking, undefined, this);

        EventBus.emit('current-scene-ready', this);
    }

    calculScore(player:Array<number>,opposant:Array<number>,position:number) {
        const player_copy = player.slice()
        const opposant_copy = opposant.slice()
    
        let current = position //position voaloany
        let score = 0
        
    
        while(player_copy[current] > 1){
            let value = player_copy[current]
            player_copy[current] = 0
            for (let i = current; i < current+value; i++) {
                player_copy[(i + 1) % 8]++;
            }
            current = (current+value)%8
            if(current <= 3){
                player_copy[current] += opposant_copy[current]
                score += opposant_copy[current]
                opposant_copy[current] = 0
                console.log("score",score);
            }
            // console.log(player_copy)
            ;
        } 
        return score
    }
    
    getMaxScore(player: any,opposant:any): any{
        let a = []
        let maxScore 
        let maxIndex 
        for (let i = 0; i < 8; i++) {
            const score = this.calculScore(player,opposant,i)
            a.push(score)  
        }
        console.log("a", a);
        
        maxScore = Math.max(...a)
        maxIndex = a.indexOf(maxScore)
        console.log("maxScore",maxScore);
        console.log("maxIndex",maxIndex )
    
        return maxIndex
    }

}
