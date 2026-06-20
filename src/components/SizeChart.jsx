import React from 'react';

export default function SizeChart() {
  return (
    <section className="section size-section" id="size-chart">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">SIZE GUIDE</span>
          <h2>Posh Pine size chart</h2>
          <p>All measurements are in inches.</p>
        </div>

        <div className="size-card">
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>M</td>
                <td>40</td>
                <td>29</td>
              </tr>
              <tr>
                <td>L</td>
                <td>42</td>
                <td>30</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>44</td>
                <td>31</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
