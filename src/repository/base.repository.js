class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async all() {
        return this.model.findAll();
    }

    async createTransaction(req) {
        const sequelize = req.app.get('sequelize');
        return await sequelize.transaction();
    }

    async commitTransaction(depositTransaction) {
        if (depositTransaction) {
            await depositTransaction.commit();
        }
    }

    async rollbackTransaction(depositTransaction) {
        if (depositTransaction) {
            await depositTransaction.rollback();
        }
    }
}

module.exports = BaseRepository;
