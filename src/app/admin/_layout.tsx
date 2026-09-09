import { NativeTabs } from 'expo-router/build/native-tabs';

export default function _layoutAdmin(){

    return (
        <>
            <NativeTabs>
                <NativeTabs.Trigger name="index">
        
                    <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/home.png')}
                    renderingMode="template"
                    />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="dashboard">
        
                    <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/home.png')}
                    renderingMode="template"
                    />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="gestion-peliculas">
        
                    <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/home.png')}
                    renderingMode="template"
                    />
                </NativeTabs.Trigger>
            </NativeTabs>
        </>
    )
}