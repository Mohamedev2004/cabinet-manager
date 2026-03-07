import { Head } from '@inertiajs/react';
import { Bento } from '@/components/welcome-page-components/bento';
import { Cta } from '@/components/welcome-page-components/cta';
import Hero from '@/components/welcome-page-components/hero';
import { Portfolio } from '@/components/welcome-page-components/portfolio';
import Services from '@/components/welcome-page-components/services';
import Layout from '@/layouts';


const Home = () => {
    return (
        <Layout>
            <Head title="Welcome" />
            <Hero />
            <Services />
            <Bento />
            <Portfolio />
            <Cta />
        </Layout>
    );
};

export default Home;
