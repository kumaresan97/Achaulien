import * as React from "react";
import styles from "./Carousel.module.scss";
import { ICarouselProps } from "./ICarouselProps";
import { escape } from "@microsoft/sp-lodash-subset";
import MainComponent from "./MainComponent";
import { sp } from "@pnp/sp/presets/all";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";

import { graph } from "@pnp/graph";
// import Fileexplorer from "./Fileexplorer";

export default class Carousel extends React.Component<ICarouselProps, {}> {
  constructor(prop: ICarouselProps, state: {}) {
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
  public render(): React.ReactElement<ICarouselProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return <MainComponent />;

    // return <Fileexplorer />;
  }
}
