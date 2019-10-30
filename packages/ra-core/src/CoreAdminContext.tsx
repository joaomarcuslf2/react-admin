import React, { FunctionComponent, ComponentType, useContext } from 'react';
import { Provider, ReactReduxContext } from 'react-redux';
import { History } from 'history';
import { createHashHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';

import { AuthContext, convertLegacyAuthProvider } from './auth';
import { DataProviderContext, convertLegacyDataProvider } from './dataProvider';
import createAdminStore, { InitialState } from './createAdminStore';
import TranslationProvider from './i18n/TranslationProvider';
import {
    AuthProvider,
    LegacyAuthProvider,
    I18nProvider,
    DataProvider,
    AdminChildren,
    CustomRoutes,
    DashboardComponent,
    LegacyDataProvider,
} from './types';

export type ChildrenFunction = () => ComponentType[];

export interface AdminProps {
    authProvider?: AuthProvider | LegacyAuthProvider;
    children?: AdminChildren;
    customSagas?: any[];
    customReducers?: object;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    dataProvider: DataProvider | LegacyDataProvider;
    history: History;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    theme?: object;
}

const CoreAdminContext: FunctionComponent<AdminProps> = ({
    authProvider,
    dataProvider,
    i18nProvider,
    children,
    history: customHistory,
    customReducers,
    customSagas,
    initialState,
}) => {
    const reduxIsAlreadyInitialized = !!useContext(ReactReduxContext);

    if (!dataProvider) {
        throw new Error(`Missing dataProvider prop.
React-admin requires a valid dataProvider function to work.`);
    }

    const finalDataProvider =
        dataProvider instanceof Function
            ? convertLegacyDataProvider(dataProvider)
            : dataProvider;

    let finalHistory = customHistory;
    const finalAuthProvider =
        authProvider instanceof Function
            ? convertLegacyAuthProvider(authProvider)
            : authProvider;

    finalHistory = customHistory || createHashHistory();

    const renderCore = () => {
        return (
            <AuthContext.Provider value={finalAuthProvider}>
                <DataProviderContext.Provider value={finalDataProvider}>
                    <TranslationProvider i18nProvider={i18nProvider}>
                        <ConnectedRouter history={finalHistory}>
                            {children}
                        </ConnectedRouter>
                    </TranslationProvider>
                </DataProviderContext.Provider>
            </AuthContext.Provider>
        );
    };

    if (reduxIsAlreadyInitialized) {
        if (!customHistory) {
            throw new Error(`Missing history prop.
When integrating react-admin inside an existing redux Provider, you must provide the same 'history' prop to the <Admin> as the one used to bootstrap your routerMiddleware.
React-admin uses this history for its own ConnectedRouter.`);
        }
        return renderCore();
    } else {
        return (
            <Provider
                store={createAdminStore({
                    authProvider: finalAuthProvider,
                    customReducers,
                    customSagas,
                    dataProvider: finalDataProvider,
                    initialState,
                    history: finalHistory,
                })}
            >
                {renderCore()}
            </Provider>
        );
    }
};

export default CoreAdminContext;