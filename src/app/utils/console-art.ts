export function printAsciiArt(color: string = '#3b82f6') {
    const art = `
%c
    ██████╗ ██╗██╗██╗███████╗██╗  ██╗██╗██╗██╗
    ██╔══██╗██║██║██║██╔════╝██║  ██║██║██║██║
    ██████╔╝██║██║██║███████╗███████║██║██║██║
    ██╔══██╗██║██║██║╚════██║██╔══██║██║██║██║
    ██║  ██║██║██║██║███████║██║  ██║██║██║██║
    ╚═╝  ╚═╝╚═╝╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝╚═╝
    
    > Portfolio v2.0 | Developed by Rishi
    `;
    const style = `color: ${color}; font-family: monospace; font-weight: 900; line-height: 1.2; text-shadow: 0 0 10px ${color}80;`;
    console.log(art, style);
}
