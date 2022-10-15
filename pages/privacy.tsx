import { NextSeo } from 'next-seo'
import classNames from 'classnames/bind'
import styles from '~/styles/Privacy.module.scss'
import Wrapper from '~/components/Wrapper'
import { server } from '~/config/constants'

const cx = classNames.bind(styles)

function Privacy() {
  return (
    <Wrapper
      Head={
        <NextSeo
          title="Privacy"
          description="Privacy Notice"
          canonical="https://writeortalk.com/privacy"
          openGraph={{
            url: 'https://writeortalk.com/privacy',
            title: 'Privacy Write or Talk Blog',
            description: 'Privacy Notice',
            images: [
              {
                url: `${server}/about.jpg`,
                alt: 'Privacy Write or Talk Blog',
                width: 800,
                height: 600
              }
            ]
          }}
        />
      }
      background={`${server}/about.jpg`}
    >
      <div className={cx('content')}>
        <h1>Privacy Notice</h1>
        <div className={cx('item')}>
          This <b>Privacy Notice</b> informs you <i>about</i> the types of personal information collected through the
          WoT Blog WoT Team website writeortalk.com, and how we use, share and protect that information.
        </div>
        <div className={cx('item')}>
          <h3>This Privacy Notice</h3>
          <ul>
            <li>Informs you about</li>
            <li>The types of personal information</li>
            <li>
              Collected through the WoT Blog WoT Team website writeortalk.com and how we use, share and protect that
              information.
            </li>
            <li>How we use, share and protect that information.</li>
          </ul>
        </div>
        <div className={cx('item')}>
          <h2>Applicability of this Privacy Notice.</h2>
          <p>
            This Privacy Notice applies to the personal information we collect on this Site (at www.writeortalk.com) and
            not to any information that we collect through other methods or services, including websites owned or
            operated by our affiliates, vendors or partners.
          </p>
        </div>
        <div className={cx('item')}>
          <h2>Information You Provide to Us.</h2>
          <p>
            We may collect and store personal information that you choose to voluntarily provide to us when you contact
            us, such as when you contact us for business purposes or in relation to a job application. Personal
            information may include your name, email address, telephone number, and your resume. We use the information
            you provide to respond to your request or question or to process your application for employment. We may
            also use the information to communicate with you about other topics that we think may be of interest to you.
          </p>
        </div>
        <div className={cx('item')}>
          <h2>Information We Collect by Automated Means.</h2>
          <p>
            We are committed to making your online experience with our Site informative and relevant. To achieve this,
            we collect certain information by automated means when you visit this Site, such as your IP address, the
            type of internet browser you are using, operating system, referring URLs, information on actions taken on
            the Site, how many users visited our Site and dates and times of Site visits. By collecting this
            information, we learn how to best tailor this Site to our visitors. We collect this information by various
            means, as explained below.
          </p>
        </div>
        <div className={cx('item')}>
          <h2>Cookies.</h2>
          <p>
            Cookies are bits of text that are placed on your computer’s hard drive or Internet-connected device when you
            visit certain websites. Cookie technology hold information a site may need to personalize a visitor’s
            experience. Cookies may also be used for security purposes and to gather website statistical data, such as
            which pages are visited, what is downloaded, and the paths taken by visitors to our website as they move
            from page to page.
          </p>
          <p>
            You do have control over cookies, and can refuse the use of cookies by selecting the appropriate settings on
            your browser. Note, however, that by not accepting or deleting the use of cookies, you may affect your
            website experience and you may not be able to take full advantage of all features on this Site. Most
            browsers will tell you how to stop accepting new cookies, how to be notified when you receive a new cookie,
            and how to disable existing cookies. Please consult the « Help » section of your browser for more
            information.
          </p>
        </div>
      </div>
    </Wrapper>
  )
}

export default Privacy
