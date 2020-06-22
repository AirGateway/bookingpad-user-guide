import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Comprehensive shopping, booking, and servicing for all NDC airlines in one single tool</>,
    imageUrl: 'img/shopping-bag.svg',
    description: (
      <>
        We aggregate shopping content, features, and bookings from all the NDC airlines you are authorized. All of it in one single and consistent web application.
      </>
    ),
  },
  {
    title: <>Modern WEB interface ready for airline rich-content and personalization</>,
    imageUrl: 'img/globe.svg',
    description: (
      <>
        NDC enables airlines to deliver rich-content and ancillary services such us paid seats, extra luggage, on-board Wifi or premium meals.
      </>
    ),
  },
  {
    title: <>Sell airline ancillary services and multiple upgrades</>,
    imageUrl: 'img/file-text.svg',
    description: (
      <>
        By using Bookingpad, partner agents can increase your value added service and revenue by selling ancillary services such as paid seats, extra luggage, on-board Wifi or premium meals, etc...
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
