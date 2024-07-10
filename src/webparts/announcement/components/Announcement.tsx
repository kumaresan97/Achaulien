import * as React from "react";
import styles from "./Announcement.module.scss";
import { IAnnouncementProps } from "./IAnnouncementProps";
import { escape } from "@microsoft/sp-lodash-subset";
import MainComponent from "./MainComponent";
import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph";

export default class Announcement extends React.Component<
  IAnnouncementProps,
  {}
> {
  constructor(prop: IAnnouncementProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
      sp: {
        baseUrl: "https://chandrudemo.sharepoint.com/sites/Achaulien",
      },
    });
    graph.setup({
      spfxContext: this.props.context,
    });
  }

  public render(): React.ReactElement<IAnnouncementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return <MainComponent context={this.props.context}></MainComponent>;
  }
}
