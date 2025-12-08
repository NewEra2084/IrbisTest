export default function pageContextStructBuilder(rule, builder){
    if (typeof rule == "string") {
        return {
            rule: (location) => location.pathname.startsWith(rule),
            builder
        };
    } else {
        return {
            rule,
            builder
        };
    }
};