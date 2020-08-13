import * as React from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    margin: theme.spacing(0),
  },
  media: {
    height: 300,
  },
}));

export const PageSkeleton: React.FC = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <Typography component="div" variant="body1">
          <Skeleton />
        </Typography>
      </PageSection>
      <PageSection>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Skeleton
                animation="wave"
                variant="circle"
                width={60}
                height={60}
              />
            }
            title={
              <Skeleton
                animation="wave"
                height={20}
                width="80%"
                style={{ marginBottom: 6 }}
              />
            }
            subheader={<Skeleton animation="wave" height={20} width="40%" />}
          />
          <Skeleton animation="wave" variant="rect" className={classes.media} />
          <CardContent>
            <React.Fragment>
              <Skeleton
                animation="wave"
                height={20}
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={20} width="80%" />
            </React.Fragment>
          </CardContent>
        </Card>
      </PageSection>
    </React.Fragment>
  );
};
