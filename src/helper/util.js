

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
    ffixwidth:()=>{
        let doc_width = util.docWidth();
        let fix_width = 0;
        if (doc_width <= util.breakpoints('sm')) {
            fix_width = doc_width * 0.95;
        } else if (doc_width <= util.breakpoints('md')) {
            fix_width = doc_width * 0.85;
        } else if (doc_width <= util.breakpoints('lg')) {
            fix_width = doc_width * 0.75;
        } else {
            fix_width = doc_width * 0.65;
        }
        return fix_width;
    },
    deepCopy:(values)=>{
        let jvalue = JSON.stringify(values)
        return JSON.parse(jvalue);
    },
    get_online:(step)=>{
        let now = dayjs();
        return now.add(step,'day');
    },
    parse_range:(srange)=>{
        let sinfos = srange.split(',');
        let sids = Array();
        for (let i = 0; i < sinfos.length; i++) {
            let spart = sinfos[i];
            let pFlag = false;
            if (spart.indexOf('-') > 0) {
                let sspart = spart.split('-');
                if (sspart.length == 2) {
                    let begin = parseInt(sspart[0])
                    let end = parseInt(sspart[1]);
                    if (!isNaN(begin) && !isNaN(end)) {
                        [begin,end] = begin>end ? [end,begin] : [begin,end];
                        for (let ii = begin; ii <= end; ii++) {
                            sids.push(ii);
                        }
                        pFlag = true;
                    }
                }
            } else {
                let lsid = parseInt(spart);
                if (!isNaN(lsid)) {
                    sids.push(lsid);
                    pFlag = true;
                }
            }
            if (!pFlag) {
                util.msg.fail('解析失败！请检查输入');
                return false;
            }
        }
        return sids;
    },
    rows2tree:(rdata, pid_val = 0, pid_key="parent_pkid",id_key="id")=>{
        if(!Array.isArray(rdata)){
            return [];
        }
        let trees = [];
        rdata.forEach(v=>{
            if(v[pid_key]==0){
                trees.push(Object.assign({},v,{children:[]}))
            }
        })
        rdata.forEach(v=>{
            if(v[pid_key]!=0){
                let v_pid_val = v[pid_key];
                trees.forEach(vv=>{
                    if(vv[id_key] == v_pid_val){
                        vv.children.push(v);
                    }
                })
            }
        })
        return trees;
    },
}