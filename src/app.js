const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();

// repositories
const ContractRepository = require('./repository/contract.repository');
const JobsRepository = require('./repository/jobs.repository');
const ProfileRepository = require('./repository/profile.repository');

const contractRepository = new ContractRepository();
const jobsRepository = new JobsRepository();
const profileRepository = new ProfileRepository();


// Services
const AdminService = require('./service/admin.service');
const ContractService = require('./service/contract.service');
const JobsService = require('./service/jobs.service');
const ProfileService = require('./service/profile.service');

const adminService = new AdminService(profileRepository);
const contractService = new ContractService(contractRepository);
const jobsService = new JobsService(jobsRepository, profileRepository);
const profileService = new ProfileService(profileRepository,jobsRepository);

// Controllers
const AdminController = require('./controller/admin.controller');
const ContractController = require('./controller/contract.controller');
const JobsController = require('./controller/jobs.controller');
const ProfileController = require('./controller/profile.controller');

const contractController = new ContractController(contractService);
const jobsController = new JobsController(jobsService);
const profileController = new ProfileController(profileService);
const adminController = new AdminController(adminService);

const adminRoutes = require('./routes/admin.routes')({ adminController });
const contractRoutes = require('./routes/contract.routes')({ contractController });
const jobRoutes = require('./routes/jobs.routes')({ jobsController });
const profileRoutes = require('./routes/profile.routes')({ profileController });

const ErrorHandler = require("./core/ErrorHandler.js");

const errorHandler = new ErrorHandler();

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)




app.use(async (err, req, res, next) => {
    await errorHandler.handleError(err);
    if (errorHandler.isTrustedError(err)) {
        next(err);
    }
    await errorHandler.handleError(err);
    next(err);
});


app.use('/contracts', contractRoutes);
app.use('/jobs', jobRoutes);
app.use('/balances', profileRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
