import * as React from "react";
import styles from "./Faq.module.scss";
import { IFaqProps } from "./IFaqProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph";
import MainComponent from "./MainComponent";

export default class Faq extends React.Component<IFaqProps, {}> {
  constructor(prop: IFaqProps, state: {}) {
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

  public render(): React.ReactElement<IFaqProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return <MainComponent context={this.props.context} />;
  }
}
