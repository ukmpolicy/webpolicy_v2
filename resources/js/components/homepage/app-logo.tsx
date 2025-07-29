import AppLogoIcon from './app-logo-icon';

export default function AppLogoHome() {
    return (
        <div className="flex items-center">
            <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="text-lg leading-tight font-bold text-white">UKM POLICY</span>
            </div>
        </div>
    );
}
