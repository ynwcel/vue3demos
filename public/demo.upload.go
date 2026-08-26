package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	var (
		svrmux = http.NewServeMux()

		svr = http.Server{
			Addr: ":8081",
		}
	)
	svrmux.HandleFunc("/", index)
	svrmux.HandleFunc("/upload", upload)
	svrmux.HandleFunc("/{method}/api", api_handler)

	svr.Handler = svrmux
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

func api_handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// 允许特定的请求方法
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE")
	// 允许特定的请求头
	w.Header().Set("Access-Control-Allow-Headers", "*")
	// 允许携带身份凭证（如Cookie）
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	header := r.Header
	header["method"] = []string{r.Method}
	header["path_method"] = []string{r.PathValue("method")}
	jv, err := json.Marshal(header)
	if err != nil {
		w.Write([]byte(`{"error":"to-json-failed"}`))
		return
	}
	w.Write(jv)
}
