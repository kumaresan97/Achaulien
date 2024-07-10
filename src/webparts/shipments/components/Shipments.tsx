import * as React from "react";
import styles from "./Shipments.module.scss";
import { IShipmentsProps } from "./IShipmentsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph";
import Maincomponent from "./Maincomponent";

export default class Shipments extends React.Component<IShipmentsProps, {}> {
  constructor(prop: IShipmentsProps, state: {}) {
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

  public render(): React.ReactElement<IShipmentsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return <Maincomponent></Maincomponent>;
  }
}
