import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  layout: {
    width: '90%',
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      width: '60%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '40%'
    },
    [theme.breakpoints.up('xl')]: {
      width: '30%'
    }
  },
  paper: {
    maxHeight: '400px',
    padding: `${theme.spacing.unit}px`,
    overflow: 'hidden',
    overflowY: 'auto'
  }
});

export const ToS = props => {
  const { classes } = props;
  return (
    <React.Fragment>
      <Typography
        variant="display3"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Privacy
      </Typography>

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography align="center" variant="display1">
            Privacy Policy
          </Typography>
          <p>Effective date: September 22, 2018</p>

          <p>
            Kasho Img App ("us", "we", or "our") operates the
            https://kasho-img-app.herokuapp.com/ website (the "Service").
          </p>

          <p>
            This page informs you of our policies regarding the collection, use,
            and disclosure of personal data when you use our Service and the
            choices you have associated with that data. Our Privacy Policy for
            Kasho Img App is managed through{' '}
            <a href="https://www.freeprivacypolicy.com/free-privacy-policy-generator.php">
              Free Privacy Policy
            </a>
            .
          </p>

          <p>
            We use your data to provide and improve the Service. By using the
            Service, you agree to the collection and use of information in
            accordance with this policy. Unless otherwise defined in this
            Privacy Policy, terms used in this Privacy Policy have the same
            meanings as in our Terms and Conditions, accessible from
            https://kasho-img-app.herokuapp.com/
          </p>

          <Typography variant="headline">Information Collection And Use</Typography>

          <p>
            We collect several different types of information for various
            purposes to provide and improve our Service to you.
          </p>

          <Typography variant="subheading">Types of Data Collected</Typography>

          <Typography variant="subheading">Personal Data</Typography>

          <p>
            While using our Service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you ("Personal Data"). Personally identifiable information
            may include, but is not limited to:
          </p>

          <ul>
            <li>First name and last name</li>
            <li>Cookies</li>
          </ul>

          <Typography variant="subheading">Usage Data</Typography>

          <Typography variant="subheading">Tracking & Cookies Data</Typography>
          <p>
            We use cookies and similar tracking technologies to track the
            activity on our Service and hold certain information.
          </p>
          <p>
            Cookies are files with small amount of data which may include an
            anonymous unique identifier. Cookies are sent to your browser from a
            website and stored on your device. Tracking technologies also used
            are beacons, tags, and scripts to collect and track information and
            to improve and analyze our Service.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. However, if you do not accept cookies,
            you may not be able to use some portions of our Service.
          </p>
          <p>Examples of Cookies we use:</p>
          <ul>
            <li>
              <strong>Session Cookies.</strong> We use Session Cookies to
              operate our Service.
            </li>
            <li>
              <strong>Security Cookies.</strong> We use Security Cookies for
              security purposes.
            </li>
          </ul>

          <Typography variant="headline">Use of Data</Typography>

          <p>Kasho Img App uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain the Service</li>
            <li>
              To allow you to participate in interactive features of our Service
              when you choose to do so
            </li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <Typography variant="headline">Transfer Of Data</Typography>
          <p>
            Your information, including Personal Data, may be transferred to —
            and maintained on — computers located outside of your state,
            province, country or other governmental jurisdiction where the data
            protection laws may differ than those from your jurisdiction.
          </p>
          <p>
            If you are located outside Canada and choose to provide information
            to us, please note that we transfer the data, including Personal
            Data, to Canada and process it there.
          </p>
          <p>
            Your consent to this Privacy Policy followed by your submission of
            such information represents your agreement to that transfer.
          </p>
          <p>
            Kasho Img App will take all steps reasonably necessary to ensure
            that your data is treated securely and in accordance with this
            Privacy Policy and no transfer of your Personal Data will take place
            to an organization or a country unless there are adequate controls
            in place including the security of your data and other personal
            information.
          </p>

          <Typography variant="headline">Disclosure Of Data</Typography>

          <Typography variant="subheading">Legal Requirements</Typography>
          <p>
            Kasho Img App may disclose your Personal Data in the good faith
            belief that such action is necessary to:
          </p>
          <ul>
            <li>To comply with a legal obligation</li>
            <li>
              To protect and defend the rights or property of Kasho Img App
            </li>
            <li>
              To prevent or investigate possible wrongdoing in connection with
              the Service
            </li>
            <li>
              To protect the personal safety of users of the Service or the
              public
            </li>
            <li>To protect against legal liability</li>
          </ul>

          <Typography variant="headline">Security Of Data</Typography>
          <p>
            The security of your data is important to us, but remember that no
            method of transmission over the Internet, or method of electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Data, we cannot guarantee
            its absolute security.
          </p>

          <Typography variant="headline">Service Providers</Typography>
          <p>
            We may employ third party companies and individuals to facilitate
            our Service ("Service Providers"), to provide the Service on our
            behalf, to perform Service-related services or to assist us in
            analyzing how our Service is used.
          </p>
          <p>
            These third parties have access to your Personal Data only to
            perform these tasks on our behalf and are obligated not to disclose
            or use it for any other purpose.
          </p>

          <Typography variant="headline">Links To Other Sites</Typography>
          <p>
            Our Service may contain links to other sites that are not operated
            by us. If you click on a third party link, you will be directed to
            that third party's site. We strongly advise you to review the
            Privacy Policy of every site you visit.
          </p>
          <p>
            We have no control over and assume no responsibility for the
            content, privacy policies or practices of any third party sites or
            services.
          </p>

          <Typography variant="headline">Children's Privacy</Typography>
          <p>
            Our Service does not address anyone under the age of 18
            ("Children").
          </p>
          <p>
            We do not knowingly collect personally identifiable information from
            anyone under the age of 18. If you are a parent or guardian and you
            are aware that your Children has provided us with Personal Data,
            please contact us. If we become aware that we have collected
            Personal Data from children without verification of parental
            consent, we take steps to remove that information from our servers.
          </p>

          <Typography variant="headline">Changes To This Privacy Policy</Typography>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            We will let you know via email and/or a prominent notice on our
            Service, prior to the change becoming effective and update the
            "effective date" at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>

          <Typography variant="headline">Contact Us</Typography>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul>
            <li>By email: kasho.dev@gmail.com</li>
          </ul>
        </Paper>
      </main>
    </React.Fragment>
  );
};

export default withStyles(styles)(ToS);
