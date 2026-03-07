import { Head } from '@inertiajs/react';
import Hero from '@/components/welcome-page-components/hero';
import Services from '@/components/welcome-page-components/services';
import Layout from '@/layouts';


const Home = () => {
    return (
        <Layout>
            <Head title="Welcome" />
            <Hero />
            <Services />
        </Layout>
    );
};

export default Home;
