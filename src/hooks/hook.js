import {WindowProvider} from "./useWindow";
import {ThemeProvider} from "./useTheme";

const Hook = ({children}) => {
    return (
        <ThemeProvider>
            <WindowProvider>
                {children}
            </WindowProvider>
        </ThemeProvider>
    );
}

export default Hook;