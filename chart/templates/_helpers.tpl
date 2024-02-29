{{- define "name" }}
{{- if contains .Chart.Name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "version" }}
{{- .Values.version | default .Chart.Version }}
{{- end }}

{{- define "chart" }}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "app.image" }}
{{- printf "%s:%s" .Values.app.image.name ( .Values.app.image.version | default .Values.version ) }}
{{- end }}
