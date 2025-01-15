import { register, login } from "../controllers/authenticaton.js";
export default (router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    console.log('authenticaton route loaded');
};
//# sourceMappingURL=authenticaation.js.map