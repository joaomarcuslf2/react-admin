import React from 'react';
import PropTypes from 'prop-types';

import { ListButton, EditButton, DeleteButton, RefreshButton } from '../button';
import CardActions from '../layout/CardActions';

const sanitizeRestProps = ({
    basePath,
    className,
    record,
    hasDelete,
    hasEdit,
    hasList,
    resource,
    ...rest
}) => rest;

/**
 * Action Toolbar for the Show view
 * 
 * Internal component. If you want to add or remove actions for a Show view,
 * write your own ShowActions Component. Then, in the <Show> component,
 * use it in the `actions` prop to pas a custom element.
 * 
 * @example
 *     import Button from 'material-ui/Button';
 *     import { CardActions, ListButton, EditButton, DeleteButton, RefreshButton, Show } from 'react-admin';
 *     
 *     const PostShowActions = ({ basePath, record }) => (
 *         <CardActions>
 *             <EditButton basePath={basePath} record={record} />
 *             <ListButton basePath={basePath} />
 *             <DeleteButton basePath={basePath} record={record} />
 *             <RefreshButton />
 *             // Add your custom actions here //
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </CardActions>
 *     );
 *
 *     export const PostShow = (props) => (
 *         <Show actions={<PostShowActions />} {...props}>
 *             ...
 *         </Show>
 *     );
 */
const ShowActions = ({
    basePath,
    className,
    record,
    hasDelete,
    hasEdit,
    hasList,
    ...rest
}) => (
    <CardActions className={className} {...sanitizeRestProps(rest)}>
        {hasEdit && <EditButton basePath={basePath} record={record} />}
        {hasList && <ListButton basePath={basePath} />}
        {hasDelete && <DeleteButton basePath={basePath} record={record} />}
        <RefreshButton />
    </CardActions>
);

ShowActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    record: PropTypes.object,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
};

export default ShowActions;
