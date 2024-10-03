import Advisor from './advisor';
import Product from './product';

Advisor.hasMany(Product, {
    foreignKey: 'advisorId',
    as: 'products',
    onUpdate: 'CASCADE',
});

Product.belongsTo(Advisor, {
    foreignKey: 'advisorId',
    as: 'advisor',
});

export { Advisor, Product };
