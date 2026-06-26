import server from './index';
import { env } from './config/env';

const port = env.PORT || 8000;
server.listen(port, () => {
    console.log(`server started on port ${port}`);
});
