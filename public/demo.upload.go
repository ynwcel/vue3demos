package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	var (
		svcmux = http.NewServeMux()

		svr = http.Server{
			Addr: fmt.Sprintf(":8081"),
		}
	)
	svcmux.HandleFunc("/", index)
	svcmux.HandleFunc("/upload", upload)

	svr.Handler = svcmux
	if err := svr.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		panic(err)
	}

}

func index(w http.ResponseWriter, r *http.Request) {

	html_content, err := os.ReadFile("./demo.upload.html")
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(`read html failed`))
		return
	}
	w.WriteHeader(200)
	w.Write(html_content)

}

func upload(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(5 * 1024 * 1024)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(`parse form failed`))
		return
	}

	var (
		txt             = r.FormValue("demotext")
		_, header, err1 = r.FormFile("demofile")
	)
	if err1 != nil {
		w.WriteHeader(500)
		w.Write([]byte(`get demofile failed`))
		return
	}
	var resut_str = fmt.Sprintf(`{"text":"%s","filesize":"%d"}`, txt, header.Size)
	w.WriteHeader(200)
	w.Write([]byte(resut_str))

}
