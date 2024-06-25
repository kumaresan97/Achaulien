import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { IQuickLinksProps } from './IQuickLinksProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MainComponent from './MainComponent';
import { sp } from '@pnp/sp/rest';
import { graph } from '@pnp/graph';

export default class QuickLinks extends React.Component<IQuickLinksProps, {}> {
  constructor(prop: IQuickLinksProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
    graph.setup({
      spfxContext: this.props.context,
    });
  }
  public render(): React.ReactElement<IQuickLinksProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
    <MainComponent/>
    );
  }
}
