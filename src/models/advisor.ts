import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from './setupDb';
import bcrypt from 'bcryptjs';

class Advisor extends Model<
    InferAttributes<Advisor>,
    InferCreationAttributes<Advisor>
> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password: string;
    declare name: string;
}

Advisor.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        modelName: 'Advisor',
        hooks: {
            async beforeCreate(advisor) {
                if (advisor.password) {
                    advisor.password = await bcrypt.hash(advisor.password, 10);
                }
            },
        },
    },
);

export default Advisor;
