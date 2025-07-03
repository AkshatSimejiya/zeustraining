
export class DataStore{
    constructor(){
        this.dataMap = new Map();
    }

    getCellData(row, col){
        return this.dataMap.get(`${row},${col}`) || '';
    }

    setCellData(row, col, value){
        this.cellData.set(`${row},${col}`, value);
    }

    deleteCellData(row, col){
        this.cellData.delete(`${row},${col}`)
    }
}