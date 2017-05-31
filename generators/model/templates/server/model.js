import {AbstractModel} from 'scaffi-server-core';

class <%= className %> extends AbstractModel {
	getModelStructure(){
		return {
			id: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			Name: this.getDataTypes().TEXT
			
		};
	}
	getModelOptions(){
		return {
			name:  {plural: "<%= className %>", singular: "<%= className %>"},
			freezeTableName: true,
			classMethods: {
				getIncludes:(db)=>{
					return [
						//{model: db.Parent}
					];
				},
				associate: function(models){
					//this.belongsTo(models.Parent);
				}
			}
		};
	}
}

export default new <%= className %>();
