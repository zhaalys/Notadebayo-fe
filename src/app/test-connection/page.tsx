"use client";

import { useState } from "react";

export default function TestConnection() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult("Testing connection...");

    try {
      // Test register
      const registerResponse = await fetch("http://localhost:3002/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Frontend",
          email: `test${Date.now()}@example.com`,
          password: "password123"
        }),
      });

      const registerData = await registerResponse.json();
      
      if (registerData.success) {
        setResult("✅ Register successful! Testing login...");
        
        // Test login
        const loginResponse = await fetch("http://localhost:3002/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: registerData.data.email,
            password: "password123"
          }),
        });

        const loginData = await loginResponse.json();
        
        if (loginData.success) {
          // Save token
          localStorage.setItem("token", loginData.data.apiKey);
          setResult(`✅ Login successful! Token saved.\nUser: ${loginData.data.name}\nEmail: ${loginData.data.email}\nToken: ${loginData.data.apiKey.substring(0, 50)}...`);
          
          // Test protected route
          const tasksResponse = await fetch("http://localhost:3002/task/", {
            headers: {
              "Authorization": `Bearer ${loginData.data.apiKey}`,
              "Content-Type": "application/json",
            },
          });

          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            setResult(prev => prev + `\n\n✅ Protected route accessible! Tasks: ${JSON.stringify(tasksData)}`);
          } else {
            setResult(prev => prev + `\n\n❌ Protected route failed: ${tasksResponse.status}`);
          }
        } else {
          setResult(`❌ Login failed: ${loginData.message}`);
        }
      } else {
        setResult(`❌ Register failed: ${registerData.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setResult(`Token: ${token ? "EXISTS" : "NOT FOUND"}\nUser: ${user ? "EXISTS" : "NOT FOUND"}\nToken value: ${token?.substring(0, 50)}...`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Connection Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Full Connection"}
          </button>
          
          <button
            onClick={checkLocalStorage}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 ml-4"
          >
            Check Local Storage
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result || "No test run yet"}</pre>
        </div>

        <div className="mt-8 space-y-2 text-sm text-gray-600">
          <p><strong>Backend URL:</strong> http://localhost:3002</p>
          <p><strong>Frontend URL:</strong> http://localhost:3000</p>
          <p><strong>Database:</strong> PostgreSQL (taskly_database)</p>
        </div>
      </div>
    </div>
  );
}
