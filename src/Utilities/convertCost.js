const PICO = 1000000000000;

export const convertCost = (cost) => {
    try{
        if(cost === null) return;
        const arrCost = cost.split(',');
        let num = arrCost.shift();
        for(let i=0; i<arrCost.length; i++){
            const adder = arrCost[i];
            num = num * 10**adder.length + parseInt(adder);
        }
        num = num / PICO;
        return num;
    }catch(e){
        console.error(e);
        return 0;
    }
}