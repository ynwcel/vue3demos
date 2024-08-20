import { message } from 'ant-design-vue'

export const util = {
    breakpoints: (tag) => {
        let all = {
            xs: 480,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1600,
        }
        if (tag) {
            if (typeof (all[tag] != 'undefined')){
                return all[tag];
            }else{
                return 0;
            }
        }else{
            return all;
        }
    },
    docWidth: () => {
        return document.documentElement.clientWidth;
    },
    fwidth: (width) => {
        let doc_width = util.docWidth();
        if (width >= doc_width) {
            if (doc_width <= util.breakpoints('sm')) {
                width = doc_width * 0.95;
            } else if (doc_width <= util.breakpoints('md')) {
                width = doc_width * 0.85;
            } else if (doc_width <= util.breakpoints('lg')) {
                width = doc_width * 0.75;
            } else {
                width = doc_width * 0.55;
            }
        }
        return width;
    },
    msg: {
        fail: (text) => {
            message.error(text);
        },
        ok: (text) => {
            message.success(text);
        },
        show: (values) => {
            if (typeof (values.message) != 'undefined' && typeof (values.flag) != 'undefined'){
                if(values.flag) {
                    return util.msg.ok(values.message || '操作成功');
                } else {
                    return util.msg.fail(values.message || '操作失败，请重试');
                }
            }
        }
    }
}