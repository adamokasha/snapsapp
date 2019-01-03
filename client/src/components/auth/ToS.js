import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

export const ToS = props => {
  const { classes } = props;
  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography align="center" variant="h4">
            Term Of Use
          </Typography>
          <Typography align="center" variant="subtitle1">
            This app is for demonstration purposes. Your Google+ or Facebook
            Account is used to quickly create your account and populate your
            profile with some initial data. Your information is not distributed
            by this site to third parties and your email will not be stored in a
            database.
          </Typography>
          <div>
            <p>
              Please read these Terms of Use ("Terms", "Terms of Use") carefully
              before using the http://snapsapp.herokuapp.com website (the
              "Service") operated by Kasho Img App ("us", "we", or "our"). Your
              access to and use of the Service is conditioned on your acceptance
              of and compliance with these Terms. These Terms apply to all
              visitors, users and others who access or use the Service. By
              accessing or using the Service you agree to be bound by these
              Terms. If you disagree with any part of the terms then you may not
              access the Service.
            </p>
            <Typography variant="body2">
              POSTING AND CONDUCT RESTRICTIONS
            </Typography>
            <p>
              When you create your own personalized account, you may be able to
              provide (“User Content”). You are solely responsible for the User
              Content that you post, upload, link to or otherwise make available
              via the Service. You agree that we are only acting as a passive
              conduit for your online distribution and publication of your User
              Content. Kasho Img App, however, reserves the right to remove any
              User Content from the Service at its discretion. The following
              rules pertain to User Content. By transmitting and submitting any
              User Content while using the Service, you agree as follows: · You
              are solely responsible for your account and the activity that
              occurs while signed in to or while using your account; · You will
              not post information that is malicious, false or inaccurate; · You
              will not submit content that is copyrighted or subject to third
              party proprietary rights, including privacy, publicity, trade
              secret, etc., unless you are the owner of such rights or have the
              appropriate permission from their rightful owner to specifically
              submit such content; and · You hereby affirm we have the right to
              determine whether any of your User Content submissions are
              appropriate and comply with these Terms of Service, remove any
              and/or all of your submissions, and terminate your account with or
              without prior notice. You understand and agree that any liability,
              loss or damage that occurs as a result of the use of any User
              Content that you make available or access through your use of the
              Service is solely your responsibility. Kasho Img App is not
              responsible for any public display or misuse of your User Content.
              Kasho Img App does not, and cannot, pre-screen or monitor all User
              Content. However, at our discretion, we, or technology we employ,
              may monitor and/or record your interactions with the Service.
            </p>
            <Typography variant="body2">Termination</Typography>
            <p>
              We may terminate or suspend access to our Service immediately,
              without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms. All
              provisions of the Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity
              and limitations of liability.
            </p>
            <Typography variant="body2">Links To Other Web Sites</Typography>
            <p>
              Our Service may contain links to thirdparty web sites or services
              that are not owned or controlled by Kasho Img App . Kasho Img App
              has no control over, and assumes no responsibility for, the
              content, privacy policies, or practices of any third party web
              sites or services. You further acknowledge and agree that Kasho
              Img App shall not be responsible or liable, directly or
              indirectly, for any damage or loss caused or alleged to be caused
              by or in connection with use of or reliance on any such content,
              goods or services available on or through any such web sites or
              services. We strongly advise you to read the terms and conditions
              and privacy policies of any third party web sites or services that
              you visit.
            </p>
            <Typography variant="body2">Governing Law</Typography>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of Canada, without regard to its conflict of law provisions.
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect. These
              Terms constitute the entire agreement between us regarding our
              Service, and supersede and replace any prior agreements we might
              have between us regarding the Service.
            </p>
            <Typography variant="body2">Cookies</Typography>
            <p>
              We employ the use of cookies. By using Kasho Img Sharing App's
              website you consent to the use of cookies in accordance with Kasho
              Img Sharing App’s privacy policy.
            </p>
            <p>
              Most of the modern day interactive web sites use cookies to enable
              us to retrieve user details for each visit. Cookies are used in
              some areas of our site to enable the functionality of this area
              and ease of use for those people visiting. Some of our affiliate /
              advertising partners may also use cookies.
            </p>
            <Typography variant="body2">Content Liability</Typography>
            <p>
              We shall have no responsibility or liability for any content
              appearing on your Web site. You agree to indemnify and defend us
              against all claims arising out of or based upon your Website. No
              link(s) may appear on any page on your Web site or within any
              context containing content or materials that may be interpreted as
              libelous, obscene or criminal, or which infringes, otherwise
              violates, or advocates the infringement or other violation of, any
              third party rights.
            </p>
            <Typography variant="body2">Changes</Typography>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will try to
              provide at least 30 (change this) days notice prior to any new
              terms taking effect. What constitutes a material change will be
              determined at our sole discretion. By continuing to access or use
              our Service after those revisions become effective, you agree to
              be bound by the revised terms. If you do not agree to the new
              terms, please stop using the Service.
            </p>
            <Typography variant="body2">Contact Us</Typography>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </Paper>
      </main>
    </React.Fragment>
  );
};

const styles = theme => ({
  layout: {
    width: "90%",
    margin: "0 auto",
    [theme.breakpoints.up("md")]: {
      width: "60%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%"
    },
    [theme.breakpoints.up("xl")]: {
      width: "30%"
    }
  },
  paper: {
    maxHeight: "400px",
    padding: `${theme.spacing.unit}px`,
    overflow: "hidden",
    overflowY: "auto"
  }
});

export default withStyles(styles)(ToS);
